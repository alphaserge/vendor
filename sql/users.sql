USE [chiffon]
GO

/****** Object:  Table [dbo].[Products]    Script Date: 08.04.2024 21:16:27 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](30) NOT NULL,
	[LastName] [varchar](30) NULL,
	[Email] [varchar](50) NOT NULL,
	[Phones] [varchar](50) NULL,
	[PasswordHash] [varchar](256) NOT NULL,
	[PasswordSalt] [varchar](256) NULL,
	[IsLocked] [bit] NOT NULL DEFAULT 0,
	[VendorId] [int] NOT NULL,
	[Created] [datetime] NOT NULL,
	[RegistrationHash] [varchar](32) NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Vendors] FOREIGN KEY([VendorId])
REFERENCES [dbo].[Vendors] ([Id])
GO

ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Vendors]
GO


