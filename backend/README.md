
# 🛠️ MERN Product Manager - Backend

## 📌 Description

Ce projet est une API REST construite avec **Node.js**, **Express** et **MongoDB**. Elle permet la **gestion d'utilisateurs** avec authentification sécurisée via `bcrypt` et `JWT`, ainsi que la **création et gestion de produits** par utilisateur.

---

## 🚀 Installation & Lancement

### 1. Cloner le projet

```bash
git clone https://github.com/votre-utilisateur/mern-product-manager.git
cd mern-product-manager/backend

````


### 2. Installer les dépendances

```bash

npm install
```
````
### 3. Créer un fichier `.env`

```env
PORT=
MONGO_URI=mongodb://localhost:27017/mern-products
JWT_SECRET=supersecretkey123456
```
````
### 4. Lancer le serveur

```bash
npm start
```

---
````
## 🧪 API Endpoints

### 🔐 Authentification

#### ➕ Inscription `POST /api/auth/register`

```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "secret123"
}
```

**Réponse**

```json
{ "message": "Utilisateur créé avec succès" }
```
````
#### 🔑 Connexion `POST /api/auth/login`

```json
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

**Réponse**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "662e13d2b843f",
    "username": "alice",
    "email": "alice@example.com"
  }
}
```

---
````
### 📦 Produits

Toutes les routes protégées nécessitent ce header :

```
Authorization: Bearer <TOKEN_JWT>
```
````
#### 🆕 Créer un produit `POST /api/products`

```json
{
  "name": "iPhone 15",
  "description": "Dernier modèle",
  "price": 1199,
  "category": "smartphone",
  "imageUrl": "https://img.com/iphone.jpg"
}
```
````
#### 📄 Voir tous les produits publics `GET /api/products`

**Filtres disponibles** :

* `?name=iphone`
* `?category=smartphone`
* `?minPrice=1000&maxPrice=1300`

**Réponse**

```json
[
  {
    "_id": "662e13988fd",
    "name": "iPhone 15",
    "price": 1199,
    "category": "smartphone",
    "owner": {
      "username": "alice",
      "email": "alice@example.com"
    }
  }
]
```
````
#### 👤 Voir les produits de l'utilisateur connecté `GET /api/products/my`

#### 🔎 Voir les détails d’un produit `GET /api/products/:id`

#### ✏️ Modifier un produit (propriétaire seulement) `PUT /api/products/:id`

```json
{
  "price": 1099
}
```
````
#### ❌ Supprimer un produit (propriétaire seulement) `DELETE /api/products/:id`

---
````
````
## 🔒 Sécurité

* Les mots de passe sont hachés avec `bcrypt`.
* Les tokens JWT expirent après 1 jour.
* Seul le propriétaire peut modifier ou supprimer son produit.

---
````
````
## 📁 Architecture

```
/backend
├── controllers
├── models
├── routes
├── middlewares
├── config
├── server.js
└── .env
```
````
## 🧠 Auteur

Ce backend a été réalisé dans le cadre d’un TP MERN collaboratif.


Étudiant : Yendi Yohann
Rôle : Backend Developer