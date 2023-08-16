Rails.application.routes.draw do
  devise_for :users
  root to: 'buoys#index'
  get "admin", to: "buoys#admin"
  get "download", to: "buoys#download"
  get "pnboia", to: "buoys#pnboia"
  post 'download_csv', to: 'buoys#download_csv'
  resources :buoys do
    member do
      patch :delete_image_attachment
      patch :add_image_attachment
    end
  end
  resources :sites do
    member do
      patch :delete_image_attachment
      patch :add_image_attachment
    end
  end

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
