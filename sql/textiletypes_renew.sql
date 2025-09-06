USE [chiffon]
GO
alter TABLE [dbo].[TextileTypes] add [Abbr] [varchar](3) NULL
GO
SET IDENTITY_INSERT [dbo].[TextileTypes] ON 
GO
delete from [dbo].[TextileTypes]
GO
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (1, 'acrylic', 'акрил', 'A')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (2, 'angora', 'ангора', 'WA')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (3, 'bamboo', 'бамбук', 'BA')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (4, 'cotton', 'хлопок', 'C')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (5, 'jute', 'джут', 'J')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (6, 'line', 'лён', 'L')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (7, 'lycra', 'лайкра', 'LY')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (8, 'metallic', 'металлик', 'ME')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (9, 'modal', 'модал', 'MD')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (10, 'nylo', 'нейлон', '')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (11, 'polyester', 'полиестер', 'P')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (12, 'polyurethane', 'полиуретан', 'PU')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (13, 'ramie', 'рами', 'RA')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (14, 'rayon (viscose)', 'вискоза', 'R')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (15, 'silk', 'шелк', 'S')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (16, 'spandex', 'спандекс', 'SP')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (17, 'tencel', 'тенсель', 'T')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (18, 'terylene', 'лавсан', 'T')
INSERT [dbo].[TextileTypes] ([Id], [TextileTypeName], [TextileTypeNameRu], [Abbr]) VALUES (19, 'wool', 'шерсть', 'W')
GO
SET IDENTITY_INSERT [dbo].[TextileTypes] OFF
GO
DBCC CHECKIDENT ('TextileTypes', RESEED, 19)
GO

alter table [dbo].[Products] drop column Composition
GO
