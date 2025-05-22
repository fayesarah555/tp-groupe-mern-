// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import '../styles/HomePage.css';

// const HomePage = () => {
//   const { isAuthenticated, user } = useAuth();

//   return (
//     <div className="home-page">
//       <div className="hero-section">
//         <div className="hero-content">
//           <h1 className="hero-title">
//             Bienvenue sur ProductApp
//           </h1>
//           <p className="hero-subtitle">
//             La plateforme collaborative pour gérer et découvrir des produits incroyables
//           </p>
          
//           {isAuthenticated ? (
//             <div className="hero-auth">
//               <h3>Bonjour {user?.username} !</h3>
//               <p>Prêt à gérer vos produits ?</p>
//               <div className="hero-buttons">
//                 <Link to="/dashboard" className="btn btn-primary">
//                   Mon Tableau de Bord
//                 </Link>
//                 <Link to="/products" className="btn btn-secondary">
//                 Découvrir les produits
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="features-section">
//         <div className="container">
//           <h2 className="section-title">Fonctionnalités principales</h2>
//           <div className="features-grid">
//             <div className="feature-card">
//               <div className="feature-icon">🛍️</div>
//               <h3>Gestion de produits</h3>
//               <p>Créez, modifiez et supprimez vos produits en toute simplicité</p>
//             </div>
//             <div className="feature-card">
//               <div className="feature-icon">🔍</div>
//               <h3>Recherche avancée</h3>
//               <p>Trouvez rapidement les produits qui vous intéressent avec nos filtres</p>
//             </div>
//             <div className="feature-card">
//               <div className="feature-icon">👥</div>
//               <h3>Plateforme collaborative</h3>
//               <p>Partagez vos produits avec la communauté et découvrez ceux des autres</p>
//             </div>
//             <div className="feature-card">
//               <div className="feature-icon">🔐</div>
//               <h3>Sécurité garantie</h3>
//               <p>Vos données sont protégées avec une authentification sécurisée</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="cta-section">
//         <div className="container">
//           <h2>Prêt à commencer ?</h2>
//           <p>Rejoignez notre communauté et commencez à gérer vos produits dès aujourd'hui</p>
//           {!isAuthenticated && (
//             <Link to="/register" className="btn btn-primary btn-large">
//               Créer un compte gratuit
//             </Link>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;" className="btn btn-secondary">
//                   Voir tous les produits
//                 </Link>
//               </div>
//             </div>
//           ) : (
//             <div className="hero-buttons">
//               <Link to="/register" className="btn btn-primary">
//                 Commencer maintenant
//               </Link>
//               <Link to="/products