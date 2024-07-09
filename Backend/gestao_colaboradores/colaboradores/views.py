from django.shortcuts import render
from rest_framework import generics, status
from .models import Colaborador, Atividade
from .serializers import ColaboradorSerializer, AtividadeSerializer, UserSerializer
from .pagination import CustomPagination 
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate 
from rest_framework.permissions import IsAuthenticated


@api_view(['POST'])
def Register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid(): # Verifica se os dados passados no pedido HTTP Post são validos
        user = serializer.save() # Cria e guarda o utilizador na base de dados
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'email and password required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials!!'}, status=status.HTTP_401_UNAUTHORIZED)


# View para listar e criar colaboradores atraves de uma classe generica do Django Rest Framework
class ColaboradorListCreate(generics.ListCreateAPIView):
    serializer_class = ColaboradorSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated] # Garantir que apenas users autenticados, ou seja, que possuem um token válido, possam aceder à view.

    # Filtrar colaboradores por sector
    def get_queryset(self):
        # Obter todos os colaboradores
        queryset = Colaborador.objects.all()
        # Obter o valor do parametro sector que pode ou não ser passado no pedido http GET
        # Se o parametro sector for passado, então filtrar os colaboradores por esse setor. Caso contrário, retornar todos os colaboradores
        sector = self.request.query_params.get('sector', None)
        if sector:
            queryset = queryset.filter(sector=sector)
        return queryset


# View para listar e criar atividades atraves de uma classe generica do Django Rest Framework
# Esta view permite filtrar atividades por colaborador e por status
class AtividadeListCreate(generics.ListCreateAPIView):
    serializer_class = AtividadeSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated] # Garantir que apenas users autenticados, ou seja, que possuem um token válido, possam aceder à view.
    
    def get_queryset(self):
        queryset = Atividade.objects.all()
        # Exemplo de filtro por colaborador
        colaborador_id = self.request.query_params.get('colaborador', None)
        if colaborador_id:
            queryset = queryset.filter(colaborador=colaborador_id)
        # Exemplo de filtro por status
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        return queryset


# View para obter/atualizar atividades
class AtividadeUpdate(generics.RetrieveUpdateAPIView):
    queryset = Atividade.objects.all()
    serializer_class = AtividadeSerializer
    permission_classes = [IsAuthenticated] # Garantir que apenas users autenticados, ou seja, que possuem um token válido, possam aceder à view.
