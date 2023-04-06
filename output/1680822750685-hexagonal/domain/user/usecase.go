package user

type UserRepository interface {
	SaveUser(*User) (int64, error)
}

type UserUseCase struct {
	UserRepository UserRepository
}

func NewUserUseCase(userRepository UserRepository) *UserUseCase {
	return &UserUseCase{UserRepository: userRepository}
}

func (uc *UserUseCase) SaveUser(newUser *User) error {
	_, err := uc.UserRepository.SaveUser(newUser)
	if err != nil {
		return err
	}
	return nil
}
