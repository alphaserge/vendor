USE [chiffon]
GO

/****** Object:  Table [dbo].[ProductStyles]    Script Date: 18.04.2026 17:41:19 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ItemNames](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ItemName] [varchar](60) NOT NULL,
 CONSTRAINT [PK_ItemNames] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

alter table Products drop column ColorNo
alter table Products drop column ColorName
alter table Products drop column PhotoDir
alter table Products drop column [FileName]
alter table Products drop column [Findings]