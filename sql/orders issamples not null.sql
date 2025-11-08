use [chiffon]

alter TABLE [dbo].[Orders] drop column [IsSamples]
GO

alter TABLE [dbo].[Orders] add [IsSamples] [bit] NOT NULL default 0
 
GO


