package handler

import (
	"fmt"
	"net/http"
	"time"

	"atp-utility-backend/internal/modules/pdf/domain"
	"github.com/gin-gonic/gin"
)

type PdfHandler struct {
	usecase domain.PdfUsecase
}

func NewPdfHandler(r *gin.Engine, u domain.PdfUsecase) {
	handler := &PdfHandler{usecase: u}
	
	pdfRoutes := r.Group("/api/pdf")
	{
		pdfRoutes.POST("/merge", handler.Merge)
	}
}

func (h *PdfHandler) Merge(c *gin.Context) {
	// Parse multipart form (max 50MB memory, rest to disk)
	err := c.Request.ParseMultipartForm(50 << 20)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse multipart form"})
		return
	}

	files := c.Request.MultipartForm.File["files"]
	if len(files) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "At least 2 PDF files are required to merge"})
		return
	}

	outputFile, cleanup, err := h.usecase.MergePDFs(c.Request.Context(), files)
	if err != nil {
		if cleanup != nil {
			cleanup()
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to merge PDFs: %v", err)})
		return
	}
	defer cleanup() // Cleanup the temp directory after the response is sent

	filename := fmt.Sprintf("merged_%d.pdf", time.Now().Unix())

	// Send file back
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("Content-Type", "application/pdf")
	
	c.File(outputFile)
}
