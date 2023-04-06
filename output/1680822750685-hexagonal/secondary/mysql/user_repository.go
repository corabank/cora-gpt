package mysql

import (
	"projectname/domain/user"
	"github.com/jinzhu/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (ur *UserRepository) SaveUser(newUser *user.User) (int64, error) {
	tx := ur.DB.Begin()
	if tx.Error != nil {
		return 0, tx.Error
	}
	err := tx.Create(&newUser).Error
	if err != nil {
		tx.Rollback()
		return 0, err
	}
	tx.Commit()
	return newUser.ID, nil
}
