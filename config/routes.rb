Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'
  get "admin", to: "pages#admin"
  get "position", to: "pages#position"
  get "english", to: "pages#english"

  resources :systems

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
