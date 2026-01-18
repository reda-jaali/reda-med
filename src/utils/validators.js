export const validateCustomer = (customer) => {
    const errors = {};
    
    if (!customer.name?.trim()) {
      errors.name = 'Le nom est requis';
    }
    
    if (customer.phone && !/^[\d\s+\-()]{8,}$/.test(customer.phone)) {
      errors.phone = 'Numéro de téléphone invalide';
    }
    
    return errors;
  };
  
  export const validateProduct = (product) => {
    const errors = {};
    
    if (!product.name?.trim()) {
      errors.name = 'Le nom du produit est requis';
    }
    
    if (!product.price || product.price <= 0) {
      errors.price = 'Le prix doit être supérieur à 0';
    }
    
    if (!product.quantity || product.quantity <= 0) {
      errors.quantity = 'La quantité doit être supérieure à 0';
    }
    
    return errors;
  };