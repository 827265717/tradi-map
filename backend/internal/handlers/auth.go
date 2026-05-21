package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/songgeng/tradi-map/backend/internal/middleware"
	"github.com/songgeng/tradi-map/backend/internal/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type authRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

func Register(db *gorm.DB, secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req authRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "服务器错误"})
			return
		}

		user := models.User{Email: req.Email, Password: string(hash)}
		if err := db.Create(&user).Error; err != nil {
			c.JSON(http.StatusConflict, gin.H{"error": "邮箱已被注册"})
			return
		}

		token, err := signToken(user.ID, secret)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "服务器错误"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"token": token, "user": user})
	}
}

func Login(db *gorm.DB, secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req authRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var user models.User
		if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "邮箱或密码错误"})
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "邮箱或密码错误"})
			return
		}

		token, err := signToken(user.ID, secret)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "服务器错误"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"token": token, "user": user})
	}
}

func signToken(userID uint, secret string) (string, error) {
	claims := middleware.Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(secret))
}
