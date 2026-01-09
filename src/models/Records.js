class Record {
  constructor({
    id,
    name = '',
    email = '',
    message = '',
    submittedAt = null
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.message = message;
    this.submittedAt = submittedAt;
  }

  getFormattedDate(locale = 'uk-UA') {
    if (!this.submittedAt) return '—';
    try {
      return new Date(this.submittedAt).toLocaleString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return this.submittedAt;
    }
  }

  getPreview(length = 100) {
    if (!this.message) return '';
    return this.message.length > length
      ? this.message.substring(0, length) + '...'
      : this.message;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      message: this.message,
      submittedAt: this.submittedAt
    };
  }
}

