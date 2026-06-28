package domain

import (
	"context"
	"mime/multipart"
)

type PdfUsecase interface {
	MergePDFs(ctx context.Context, files []*multipart.FileHeader) (string, func(), error)
}
