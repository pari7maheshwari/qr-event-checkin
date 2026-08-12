from database import SessionLocal
from models.admin import Admin
from auth import hash_password


def create_admin():
    db = SessionLocal()

    try:
        username = input("Enter admin username: ")
        email = input("Enter admin email: ")
        password = input("Enter admin password: ")

        existing_admin = (
            db.query(Admin)
            .filter(Admin.username == username)
            .first()
        )

        if existing_admin:
            print("Admin with this username already exists.")
            return

        password_hash = hash_password(password)

        admin = Admin(
            username=username,
            email=email,
            password_hash=password_hash,
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("\nAdmin created successfully!")
        print(f"Username: {admin.username}")
        print(f"Email: {admin.email}")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()