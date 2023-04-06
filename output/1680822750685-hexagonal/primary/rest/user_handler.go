package rest

import (
	"encoding/json"
	"net/http"
	"projectname/domain/user"
)

type UserHandler struct {
	UserUseCase user.UseCase
}

func NewUserHandler(userUseCase user.UseCase) *UserHandler {
	return &UserHandler{UserUseCase: userUseCase}
}

func (h *UserHandler) SaveUser(w http.ResponseWriter, r *http.Request) {
	var newUser user.User
	err := json.NewDecoder(r.Body).Decode(&newUser)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Invalid request body"))
		return
	}
	err = h.UserUseCase.SaveUser(&newUser)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Error saving user"))
		return
	}
	w.WriteHeader(http.StatusCreated)
}
