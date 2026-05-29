USE [chiffon]
GO

/****** Object:  Table [dbo].[ProductDesigns]    Script Date: 26.05.2026 12:53:09 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

alter table [dbo].[ProductDesigns] drop column [PhotoUuids]
go
alter table [dbo].[ProductDesigns] drop column [VideoUuids]
go
alter table [dbo].[ProductDesigns] drop column [AllColorsPhotoUuid]
go
alter table [dbo].[ProductDesigns] add [MediaUuids] [varchar](304) NULL
go

alter TABLE [dbo].[Products] drop column [PhotoUuids]
go
alter TABLE [dbo].[Products] drop column [VideoUuids]
go
alter TABLE [dbo].[Products] add [MediaUuids] [varchar](76)
go


alter TABLE [dbo].[Products] drop column [MediaUuids] 
go
alter TABLE [dbo].[Products] add [PhotoUuid] [varchar](36) NULL
go
alter TABLE [dbo].[Products] add [VideoUuid] [varchar](36) NULL
go


alter TABLE [dbo].[ProductDesigns] drop column MediaUuids
go
alter TABLE [dbo].[ProductDesigns] add [PhotoUuid1] [varchar](36) NULL
go
alter TABLE [dbo].[ProductDesigns] add [PhotoUuid2] [varchar](36) NULL
go
alter TABLE [dbo].[ProductDesigns] add [PhotoUuid3] [varchar](36) NULL
go
alter TABLE [dbo].[ProductDesigns] add [PhotoUuid4] [varchar](36) NULL
go

alter table [dbo].[ProductDesigns] drop column [PhotoUuid1]
go
alter table [dbo].[ProductDesigns] drop column [PhotoUuid2]
go
alter table [dbo].[ProductDesigns] drop column [PhotoUuid3]
go
alter table [dbo].[ProductDesigns] drop column [PhotoUuid4]
go
alter table [dbo].[ProductDesigns] add [PhotoUuids] [varchar](222) NULL
go
alter table [dbo].[ProductDesigns] add [VideoUuid] [varchar](36) NULL
go
alter table [dbo].[ProductDesigns] drop column [VideoUuid]
go
