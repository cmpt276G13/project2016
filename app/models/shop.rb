class Shop < ActiveRecord::Base
  validates :name, presence: true, length: {maximum: 50}
  validates :description, presence: true, length: {maximum: 500}
  validates :price, presence: true
end
