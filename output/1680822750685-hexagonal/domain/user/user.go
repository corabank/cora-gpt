package user

type User struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
	Age  int    `json:"age"`
}

type UseCase interface {
	SaveUser(*User) error
}
