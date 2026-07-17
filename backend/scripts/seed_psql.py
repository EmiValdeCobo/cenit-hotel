import os
import subprocess

def seed_database():
    # Ruta absoluta al archivo SQL en tu máquina
    seed_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'seed_data.sql'))
    
    if not os.path.exists(seed_file_path):
        print("Seed file not found. Skipping seeding.")
        return

    print("Ejecutando seed data dentro del contenedor de PostgreSQL...")

    # El comando docker exec envía el archivo al contenedor y lo ejecuta
    # 'cenit_postgres' es el nombre del contenedor definido en tu docker-compose.yml
    try:
        # Comando: cat archivo | docker exec -i contenedor psql -U usuario -d base_de_datos
        with open(seed_file_path, 'r') as f:
            subprocess.run(
                ['docker', 'exec', '-i', 'cenit_postgres', 'psql', '-U', 'postgres', '-d', 'cenit_db'],
                stdin=f,
                check=True
            )
        print("Database seeded successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error seeding database: {e}")

if __name__ == "__main__":
    seed_database()