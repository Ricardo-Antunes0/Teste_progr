from django.db import models
from .helpers import normalize_string

# Create your models here.

# Modelos: 
# colaborador
# atividade


class Colaborador(models.Model):
    fullname = models.CharField(max_length=255)
    position = models.CharField(max_length=100)
    admission_date = models.DateField()
    sector = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Retornar o nome do colaborador no lugar do objeto
    def _str_(self):
        return self.fullname

    def save(self, *args, **kwargs):
        self.sector = normalize_string(self.sector)
        super().save(*args, **kwargs)
    

class Atividade(models.Model):
    # Lista de tuplos para os diferentes estados de uma atividade
    # Em cada triplo, o primeiro elemento é o valor guardado na base de dados
    # O segundo é o valor que será exibido ao user
    status_choices = [('pendente', 'Pendente'), ('em_andamento', 'Em Andamento'), ('concluida', 'Concluida')]
    description = models.TextField()
    # Cria uma relacionamento entre a atividade e o colaborador. Caso o colaborador for apagado, as atividades relacionadas a ele também são
    # Related_name = 'atividades' serve para aceder às atividades de um certo colaborador
    colaborador = models.ForeignKey(Colaborador, on_delete=models.CASCADE, related_name='atividades')
    # Definir um campo de caracteres, restringindo os valores possiveis a uma lista de escolhas. O valor padrão é 'pendente'
    status = models.CharField(max_length=12, choices=status_choices, default='pendente')
    # Retornar a descricao da atividade no lugar do objeto
    def _str_(self):
        return self.description