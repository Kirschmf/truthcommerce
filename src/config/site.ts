export const SITE_CONTACT = {
  email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'contato@truthcommerce.com.br',
  instagramUrl:
    import.meta.env.VITE_INSTAGRAM_URL?.trim() || 'https://www.instagram.com/truth.commerce/',
  linkedinUrl:
    import.meta.env.VITE_LINKEDIN_URL?.trim() || 'https://www.linkedin.com/company/truth-commerce/',
  whatsappUrl: import.meta.env.VITE_WHATSAPP_URL?.trim() || null,
} as const

export const PRIMARY_CONTACT_HREF = SITE_CONTACT.whatsappUrl || `mailto:${SITE_CONTACT.email}`
