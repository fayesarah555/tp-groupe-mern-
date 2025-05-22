import os

# Arborescence à créer
structure = {
    "backend": {
        "controllers": ["authController.js", "productController.js"],
        "models": ["User.js", "Product.js"],
        "middlewares": ["authMiddleware.js", "ownerMiddleware.js"],
        "routes": ["authRoutes.js", "productRoutes.js"],
        "config": ["db.js"],
        "": ["server.js", ".env"]
    }
}

def create_structure(base_path, tree):
    for folder, content in tree.items():
        folder_path = os.path.join(base_path, folder)
        os.makedirs(folder_path, exist_ok=True)
        for subfolder, files in content.items():
            subfolder_path = os.path.join(folder_path, subfolder)
            os.makedirs(subfolder_path, exist_ok=True)
            for file in files:
                file_path = os.path.join(subfolder_path, file)
                with open(file_path, 'w') as f:
                    f.write("// " + file)  # Fichier vide avec un commentaire
        print(f"✅ Dossier {folder} créé avec ses sous-dossiers et fichiers.")

# Exécution
create_structure(".", structure)
