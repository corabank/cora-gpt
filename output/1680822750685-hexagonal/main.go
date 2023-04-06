package main

import (
	"projectname/infra/mysql"
	"projectname/infra/rest"
	"projectname/domain/user"
)

func main() {
	db := mysql.NewDB()
	userRepo := mysql.NewUserRepository(db)
	userUseCase := user.NewUserUseCase(userRepo)
	userHandler := rest.NewUserHandler(userUseCase)

	r := rest.NewRouter(userHandler)
	r.Start()
}
