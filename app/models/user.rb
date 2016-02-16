class User < ActiveRecord::Base
  before_save {
    #Ensures entries are unique in the database
    self.username = username.downcase,
    self.email = email.downcase
  }
  validates :username, presence: true, length: {maximum: 50},
            uniqueness: {case_sensitive: false}
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
  validates :email, presence: true, length: {maximum: 255},
            format: { with: VALID_EMAIL_REGEX },
            uniqueness: {case_sensitive: false}
  has_secure_password
  validates :password, presence: true, length: { minimum: 6 }
end
