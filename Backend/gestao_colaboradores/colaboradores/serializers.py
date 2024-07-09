
from rest_framework import serializers
from .models import Colaborador, Atividade
from datetime import date
from django.contrib.auth.models import User


# Serve para serializar e desserializar os objetos do modelo Colaborador -> converter objetos do modelo Colaborador em json e vice-versa
class ColaboradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colaborador
        fields = '__all__'

    # Funções para validar os campos do modelo Colaborador
    def validate_salary(self, value):
        if value < 0:
            raise serializers.ValidationError("The salary must be an positive number")
        return value
    
    def validate_admission_date(self, value):
        if value > date.today():
            raise serializers.ValidationError("The Admission date cannot be after the current date")
        return value


# Serve para serializar e desserializar os objetos do modelo Atividade
class AtividadeSerializer(serializers.ModelSerializer):
    # Validação do valor do colaborador para garantir que corresponde a um id de um colaborador existente
    colaborador = serializers.PrimaryKeyRelatedField(queryset=Colaborador.objects.all())
    # Campo que serve para retornar o nome do colaborador associado à atividade
    colaborador_fullname = serializers.SerializerMethodField()

    class Meta:
        model = Atividade
        fields = ['id', 'description', 'colaborador', 'colaborador_fullname', 'status']
    
    # Retorna o nome do colaborador associado à respetiva atividade
    def get_colaborador_fullname(self, obj):
        return obj.colaborador.fullname

    # Validar o status da atividade
    def validate_status(self, value):
        if value not in ['pendente', 'em_andamento', 'concluida']:
            raise serializers.ValidationError("The status is invalid!")
        return value
    

# Serve para serializar e desserializar os objetos do modelo User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], password=validated_data['password'])
        return user
    
    