import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const TRANSLATIONS: { [key: string]: any } = {
  pt: {
    'nav.dashboard': 'Painel',
    'nav.admin': 'Administração',
    'nav.logout': 'Sair',
    'auth.login_title': 'Bem-vindo de volta!',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.login_btn': 'Entrar',
    'auth.no_account': 'Não tem conta? Registe-se',
    'auth.register_title': 'Criar Conta',
    'auth.name': 'Nome',
    'auth.register_btn': 'Registar',
    'auth.has_account': 'Já tem conta? Entre',
    'dash.search_placeholder': 'Procurar cidade...',
    'dash.search_btn': 'Pesquisar',
    'dash.favorites': 'Meus Favoritos',
    'dash.history': 'Histórico',
    'dash.export': 'Exportar Histórico',
    'weather.temp': 'Temperatura',
    'weather.feels_like': 'Sensação',
    'weather.humidity': 'Humidade',
    'weather.wind': 'Vento',
    'weather.add_fav': 'Adicionar aos Favoritos',
    'weather.remove_fav': 'Remover dos Favoritos',
    'footer.rights': 'Todos os direitos reservados.',
    'error.city_not_found': 'Cidade não encontrada. Verifique o nome e tente novamente.',
    'admin.users': 'Gestão de Utilizadores',
    'admin.name': 'Nome',
    'admin.email': 'Email',
    'admin.role': 'Função',
    'admin.actions': 'Ações',
    'admin.delete': 'Eliminar',
    'profile.title': 'O meu Perfil',
    'profile.subtitle': 'Mantenha os seus dados atualizados',
    'profile.new_password': 'Nova Senha (deixar em branco para manter)',
    'profile.password_placeholder': 'Mínimo 6 caracteres',
    'profile.save_btn': 'Guardar Alterações',
    'admin.stats.users': 'Utilizadores Registados',
    'admin.stats.searches': 'Pesquisas Realizadas',
    'admin.stats.favorites': 'Cidades Favoritas',
    'admin.create_user': 'Novo Utilizador',
    'admin.edit_user': 'Editar Utilizador',
    'admin.save': 'Guardar',
    'admin.cancel': 'Cancelar',
    'admin.subtitle': 'Gestão centralizada de utilizadores e estatísticas do sistema',
    'admin.user_list': 'Lista de Utilizadores',
    'auth.forgot_title': 'Recuperar Senha',
    'auth.forgot_subtitle': 'Introduza o seu e-mail e enviaremos instruções para redefinir a sua senha.',
    'auth.send_reset_btn': 'Enviar Instruções',
    'auth.back_to_login': 'Voltar ao Login',
    'auth.reset_title': 'Redefinir Senha',
    'auth.new_password': 'Nova Senha',
    'auth.confirm_password': 'Confirmar Nova Senha',
    'auth.reset_btn': 'Atualizar Senha',
    'auth.reset_success': 'A sua senha foi atualizada com sucesso!',
    'auth.forgot_link': 'Esqueceu a senha?'
  },
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Administration',
    'nav.logout': 'Logout',
    'auth.login_title': 'Welcome back!',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.login_btn': 'Login',
    'auth.no_account': 'No account? Register',
    'auth.register_title': 'Create Account',
    'auth.name': 'Name',
    'auth.register_btn': 'Register',
    'auth.has_account': 'Already have an account? Login',
    'dash.search_placeholder': 'Search city...',
    'dash.search_btn': 'Search',
    'dash.favorites': 'My Favorites',
    'dash.history': 'History',
    'dash.export': 'Export History',
    'weather.temp': 'Temperature',
    'weather.feels_like': 'Feels Like',
    'weather.humidity': 'Humidity',
    'weather.wind': 'Wind',
    'weather.add_fav': 'Add to Favorites',
    'weather.remove_fav': 'Remove from Favorites',
    'footer.rights': 'All rights reserved.',
    'error.city_not_found': 'City not found. Please check the name and try again.',
    'admin.users': 'User Management',
    'admin.name': 'Name',
    'admin.email': 'Email',
    'admin.role': 'Role',
    'admin.actions': 'Actions',
    'admin.delete': 'Delete',
    'profile.title': 'My Profile',
    'profile.subtitle': 'Keep your data up to date',
    'profile.new_password': 'New Password (leave blank to keep)',
    'profile.password_placeholder': 'Minimum 6 characters',
    'profile.save_btn': 'Save Changes',
    'admin.stats.users': 'Registered Users',
    'admin.stats.searches': 'Total Searches',
    'admin.stats.favorites': 'Favorite Cities',
    'admin.create_user': 'New User',
    'admin.edit_user': 'Edit User',
    'admin.save': 'Save',
    'admin.cancel': 'Cancel',
    'admin.subtitle': 'Centralized management of users and system statistics',
    'admin.user_list': 'User List',
    'auth.forgot_title': 'Recover Password',
    'auth.forgot_subtitle': 'Enter your email and we will send you instructions to reset your password.',
    'auth.send_reset_btn': 'Send Instructions',
    'auth.back_to_login': 'Back to Login',
    'auth.reset_title': 'Reset Password',
    'auth.new_password': 'New Password',
    'auth.confirm_password': 'Confirm New Password',
    'auth.reset_btn': 'Update Password',
    'auth.reset_success': 'Your password has been successfully updated!',
    'auth.forgot_link': 'Forgot password?'
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = new BehaviorSubject<string>(localStorage.getItem('lang') || 'pt');
  lang$ = this.currentLang.asObservable();

  constructor() {}

  setLanguage(lang: string) {
    this.currentLang.next(lang);
    localStorage.setItem('lang', lang);
  }

  get currentLanguage(): string {
    return this.currentLang.value;
  }

  translate(key: string): string {
    const lang = this.currentLanguage;
    return TRANSLATIONS[lang][key] || key;
  }
}
