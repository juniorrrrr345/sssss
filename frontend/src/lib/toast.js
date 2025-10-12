/**
 * Système de notifications toast simple
 */
class Toast {
  success(message) {
    this.show(message, 'success');
  }

  error(message) {
    this.show(message, 'error');
  }

  info(message) {
    this.show(message, 'info');
  }

  warning(message) {
    this.show(message, 'warning');
  }

  show(message, type = 'info') {
    // Vous pouvez intégrer une bibliothèque de toast comme react-hot-toast ou sonner
    console.log(`[${type.toUpperCase()}]`, message);
    
    // Pour l'instant, utilise l'alert du navigateur
    if (type === 'error') {
      alert(`Erreur: ${message}`);
    } else if (type === 'success') {
      alert(`Succès: ${message}`);
    }
  }
}

export default new Toast();
