interface PrintTemplateConfig {
    createdAt: string
    documentId: string
    id: string
    fileId: string
    name: string
    program: string
    repeatableStages: {
      crescente: any
      decrescente: any
    }
    updatedAt: string
}

export type { PrintTemplateConfig }