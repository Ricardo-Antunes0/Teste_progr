import unicodedata


# Função para normalizar strings
def normalize_string(value):
    # Remover acentos e caracteres especiais
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('utf-8')
    # Converte a string para minúsculas
    value = value.lower()
    
    value = value.title()
    # Remove espaços em excesso
    return value.strip()
