from django.urls import path
from . import views

urlpatterns = [
    path('colaboradores/', views.ColaboradorListCreate.as_view(), name='colaborador-list-create'),
    path('atividades/', views.AtividadeListCreate.as_view(), name='atividade-list-create'),
    path('atividades/<int:pk>/', views.AtividadeUpdate.as_view(), name='atividade-update'),
    path('register/', views.Register, name='register'),
    path('login/', views.login, name='login'),

]
