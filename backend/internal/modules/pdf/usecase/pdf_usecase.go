package usecase

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"

	"atp-utility-backend/internal/modules/pdf/domain"
	"github.com/pdfcpu/pdfcpu/pkg/api"
)

type pdfUsecase struct{}

func NewPdfUsecase() domain.PdfUsecase {
	return &pdfUsecase{}
}

func (u *pdfUsecase) MergePDFs(ctx context.Context, files []*multipart.FileHeader) (string, func(), error) {
	// Create a temporary directory for this merge operation
	tmpDir, err := os.MkdirTemp("", "pdf-merge-*")
	if err != nil {
		return "", nil, fmt.Errorf("failed to create temp dir: %w", err)
	}
	
	cleanup := func() {
		os.RemoveAll(tmpDir)
	}

	var inputFiles []string
	for i, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			return "", cleanup, fmt.Errorf("failed to open uploaded file: %w", err)
		}

		tmpFilePath := filepath.Join(tmpDir, fmt.Sprintf("input_%d.pdf", i))
		dst, err := os.Create(tmpFilePath)
		if err != nil {
			file.Close()
			return "", cleanup, fmt.Errorf("failed to create temp file: %w", err)
		}

		if _, err := io.Copy(dst, file); err != nil {
			dst.Close()
			file.Close()
			return "", cleanup, fmt.Errorf("failed to copy to temp file: %w", err)
		}
		dst.Close()
		file.Close()
		
		inputFiles = append(inputFiles, tmpFilePath)
	}

	outputFile := filepath.Join(tmpDir, "merged_output.pdf")
	
	// Merge using pdfcpu
	if err := api.MergeCreateFile(inputFiles, outputFile, false, nil); err != nil {
		return "", cleanup, fmt.Errorf("pdfcpu merge failed: %w", err)
	}

	return outputFile, cleanup, nil
}
