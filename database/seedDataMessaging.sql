USE SocialMedia;
GO
SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;
GO

-- Dữ liệu mẫu cho bảng Conversations
INSERT INTO Messaging.Conversations (ConversationName, GroupImageURL, IsGroupChat, LastMessageID, CreatedAt, CreatedByUserID)
VALUES
    -- Cuộc trò chuyện cá nhân
    (N'Cuộc trò chuyện với Nguyễn An', NULL, 0, NULL, '2023-10-01 08:00:00', 1),
    (N'Cuộc trò chuyện với Minh Tuan', NULL, 0, NULL, '2023-10-02 09:00:00', 2),
    (N'Cuộc trò chuyện với Huy Hoàng', NULL, 0, NULL, '2023-10-03 10:00:00', 3),
    (N'Cuộc trò chuyện với Thu Hà', NULL, 0, NULL, '2023-10-04 08:30:00', 4),
    (N'Cuộc trò chuyện với An Bình', NULL, 0, NULL, '2023-10-05 09:30:00', 5),
    (N'Cuộc trò chuyện với Duy Tân', NULL, 0, NULL, '2023-10-06 10:45:00', 6),
    (N'Cuộc trò chuyện với Hải Linh', NULL, 0, NULL, '2023-10-07 11:15:00', 7),
    (N'Cuộc trò chuyện với Minh Châu', NULL, 0, NULL, '2023-10-08 12:00:00', 8),
    (N'Cuộc trò chuyện với Khánh Linh', NULL, 0, NULL, '2023-10-09 13:30:00', 9),
    (N'Cuộc trò chuyện với Ngọc Hà', NULL, 0, NULL, '2023-10-10 14:20:00', 10),

    -- Cuộc trò chuyện nhóm
    (N'Cuộc họp nhóm A', 'https://example.com/groupA.jpg', 1, NULL, '2023-10-01 11:00:00', 4),
    (N'Nhóm học lập trình', 'https://example.com/groupB.jpg', 1, NULL, '2023-10-02 14:00:00', 5),
    (N'Chuyến du lịch Đà Nẵng', 'https://example.com/groupC.jpg', 1, NULL, '2023-10-03 15:00:00', 6),
    (N'Chuyện công việc', 'https://example.com/groupD.jpg', 1, NULL, '2023-10-05 10:00:00', 9),
    (N'Đội ngũ phát triển dự án', 'https://example.com/groupE.jpg', 1, NULL, '2023-10-06 13:45:00', 7),
    (N'Nhóm chia sẻ kỹ năng', 'https://example.com/groupF.jpg', 1, NULL, '2023-10-07 16:00:00', 8),
    (N'Chuyến đi chơi Hà Nội', 'https://example.com/groupG.jpg', 1, NULL, '2023-10-08 17:30:00', 3),
    (N'Nhóm sáng tạo nội dung', 'https://example.com/groupH.jpg', 1, NULL, '2023-10-09 18:00:00', 2),
    (N'Hội thảo kỹ thuật', 'https://example.com/groupI.jpg', 1, NULL, '2023-10-10 19:15:00', 1),
    (N'Nhóm đọc sách', 'https://example.com/groupJ.jpg', 1, NULL, '2023-10-11 20:30:00', 4);

-- Dữ liệu mẫu cho bảng ConversationMembers
INSERT INTO Messaging.ConversationMembers (ConversationID, UserID, Nickname, Role, LastReadMessageID, MutedUntil, JoinedAt)
VALUES
    -- Cuộc trò chuyện cá nhân
    (1, 1, N'Nguyễn An', 'MEMBER', NULL, NULL, '2023-10-01 08:00:00'),
    (1, 2, 'Minh Tuan', 'MEMBER', NULL, NULL, '2023-10-01 08:15:00'),
    (1, 3, N'Huy Hoàng', 'MEMBER', NULL, NULL, '2023-10-01 08:30:00'),
    (2, 4, N'Thu Hà', 'MEMBER', NULL, NULL, '2023-10-02 09:00:00'),
    (2, 5, N'An Bình', 'ADMIN', NULL, NULL, '2023-10-02 09:15:00'),
    (3, 6, N'Duy Tân', 'MEMBER', NULL, NULL, '2023-10-03 10:00:00'),
    (3, 7, N'Hải Linh', 'MEMBER', NULL, NULL, '2023-10-03 10:30:00'),
    (4, 8, N'Minh Châu', 'MEMBER', NULL, NULL, '2023-10-04 08:30:00'),
    (4, 9, N'Khánh Linh', 'MEMBER', NULL, NULL, '2023-10-04 08:45:00'),
    (5, 10, N'Ngọc Hà', 'ADMIN', NULL, NULL, '2023-10-05 09:00:00'),

    -- Cuộc trò chuyện nhóm
    (6, 1, N'Nguyễn An', 'ADMIN', NULL, NULL, '2023-10-06 10:00:00'),
    (6, 2, 'Minh Tuan', 'MEMBER', NULL, NULL, '2023-10-06 10:15:00'),
    (7, 3, N'Huy Hoàng', 'MEMBER', NULL, NULL, '2023-10-07 11:00:00'),
    (7, 4, N'Thu Hà', 'MEMBER', NULL, NULL, '2023-10-07 11:30:00'),
    (8, 5, N'An Bình', 'ADMIN', NULL, NULL, '2023-10-08 12:00:00'),
    (8, 6, N'Duy Tân', 'MEMBER', NULL, NULL, '2023-10-08 12:30:00'),
    (9, 7, N'Hải Linh', 'MEMBER', NULL, NULL, '2023-10-09 13:00:00'),
    (9, 8, N'Minh Châu', 'MEMBER', NULL, NULL, '2023-10-09 13:15:00'),
    (10, 9, N'Khánh Linh', 'MEMBER', NULL, NULL, '2023-10-10 14:00:00'),
    (10, 10, N'Ngọc Hà', 'ADMIN', NULL, NULL, '2023-10-10 14:30:00');

-- Dữ liệu cho bảng Messages
INSERT INTO CoreData.InteractableItems (ItemType, CreatedAt)
VALUES
    ('MEDIA', '2023-10-01 08:05:00'),
    ('MEDIA', '2023-10-01 08:15:00'),
    ('MEDIA', '2023-10-01 08:30:00'),
    ('MEDIA', '2023-10-02 10:05:00'),
    ('MEDIA', '2023-10-02 10:15:00'),
    ('MEDIA', '2023-10-02 11:10:00'),
    ('MEDIA', '2023-10-02 11:20:00'),
    ('MEDIA', '2023-10-03 14:10:00'),
    ('MEDIA', '2023-10-03 14:30:00'),
    ('MEDIA', '2023-10-04 09:05:00'),
    ('MEDIA', '2023-10-04 09:20:00'),
    ('MEDIA', '2023-10-04 09:40:00'),
    ('MEDIA', '2023-10-05 11:00:00'),
    ('MEDIA', '2023-10-05 11:30:00'),
    ('MEDIA', '2023-10-06 12:00:00'),
    ('MEDIA', '2023-10-06 12:30:00'),
    ('MEDIA', '2023-10-07 13:00:00'),
    ('MEDIA', '2023-10-07 13:15:00'),
    ('MEDIA', '2023-10-08 14:00:00'),
    ('MEDIA', '2023-10-08 14:30:00');
-- Dữ liệu mẫu cho bảng Messages (Cập nhật InteractableItemID bắt đầu từ 101)
INSERT INTO Messaging.Messages (ConversationID, SenderID, InteractableItemID, ReplyToMessageID, MessageType, SentAt, IsDeleted)
VALUES
    (1, 1, 101, NULL, 'TEXT', '2023-10-01 08:05:00', 0),
    (1, 2, 102, NULL, 'TEXT', '2023-10-01 08:15:00', 0),
    (1, 3, 103, NULL, 'TEXT', '2023-10-01 08:30:00', 0),
    (2, 4, 104, NULL, 'TEXT', '2023-10-02 10:05:00', 0),
    (2, 5, 105, NULL, 'TEXT', '2023-10-02 10:15:00', 0),
    (3, 6, 106, NULL, 'TEXT', '2023-10-02 11:10:00', 0),
    (3, 7, 107, NULL, 'TEXT', '2023-10-02 11:20:00', 0),
    (4, 8, 108, NULL, 'TEXT', '2023-10-03 14:10:00', 0),
    (4, 9, 109, NULL, 'TEXT', '2023-10-03 14:30:00', 0),
    (5, 10, 110, NULL, 'TEXT', '2023-10-04 09:05:00', 0),
    (6, 1, 111, NULL, 'TEXT', '2023-10-04 09:20:00', 0),
    (6, 2, 112, NULL, 'TEXT', '2023-10-04 09:40:00', 0),
    (7, 3, 113, NULL, 'TEXT', '2023-10-05 11:00:00', 0),
    (7, 4, 114, NULL, 'TEXT', '2023-10-05 11:30:00', 0),
    (8, 5, 115, NULL, 'TEXT', '2023-10-06 12:00:00', 0),
    (8, 6, 116, NULL, 'TEXT', '2023-10-06 12:30:00', 0),
    (9, 7, 117, NULL, 'TEXT', '2023-10-07 13:00:00', 0),
    (9, 8, 118, NULL, 'TEXT', '2023-10-07 13:15:00', 0),
    (10, 9, 119, NULL, 'TEXT', '2023-10-08 14:00:00', 0),
    (10, 10, 120, NULL, 'TEXT', '2023-10-08 14:30:00', 0);

INSERT INTO Messaging.MessageBodies (MessageID, Content)
VALUES
    (1, N'Chào mọi người, đây là bức ảnh tuyệt vời từ chuyến đi!'),
    (2, N'Mình cũng thích bức ảnh này, rất đẹp!'),
    (3, N'Video này rất hay, cảm ơn bạn đã chia sẻ!'),
    (4, N'Chào mọi người, đây là một video rất thú vị!'),
    (5, N'Cảm ơn bạn đã chia sẻ, mình rất thích!'),
    (6, N'Bức ảnh này khiến tôi nhớ về một chuyến đi tuyệt vời!'),
    (7, N'Cảm ơn vì video này, mình sẽ thử ngay!'),
    (8, N'Thật tuyệt vời khi có thể xem những bức ảnh đẹp như thế này!'),
    (9, N'Video này cực kỳ hấp dẫn, tôi sẽ chia sẻ cho bạn bè!'),
    (10, N'Bức ảnh này mang lại cảm giác thư giãn, cảm ơn bạn!'),
    (11, N'Mình rất thích bức ảnh này, cảm ơn bạn đã chia sẻ!'),
    (12, N'Video này thật sự rất hữu ích, cảm ơn vì đã chia sẻ!'),
    (13, N'Chuyến đi này thật tuyệt, mình rất muốn xem thêm những bức ảnh khác!'),
    (14, N'Video này quá hay, mình sẽ làm theo ngay!'),
    (15, N'Bức ảnh này quá đẹp, tôi phải chia sẻ ngay!'),
    (16, N'Video này quá tuyệt, tôi đã học được rất nhiều!'),
    (17, N'Cảm ơn vì đã chia sẻ video này, rất hay!'),
    (18, N'Bức ảnh này rất đẹp, tôi đã thử làm theo!'),
    (19, N'Video này rất bổ ích, cảm ơn bạn đã chia sẻ!'),
    (20, N'Chuyến đi này khiến tôi cảm thấy thật thư giãn!');

-- Dữ liệu mẫu cho bảng MessageMedia
INSERT INTO Messaging.MessageMedia (MessageID, MediaName, MediaType, FileName, FileSize, ThumbnailName)
VALUES
    (1, 'https://example.com/media1.jpg', 'IMAGE', 'media1.jpg', 1024, 'https://example.com/thumb1.jpg'),
    (2, 'https://example.com/media2.jpg', 'IMAGE', 'media2.jpg', 2048, 'https://example.com/thumb2.jpg'),
    (3, 'https://example.com/video1.mp4', 'VIDEO', 'video1.mp4', 10485760, 'https://example.com/thumb3.jpg'),
    (4, 'https://example.com/video2.mp4', 'VIDEO', 'video2.mp4', 20971520, 'https://example.com/thumb4.jpg'),
    (5, 'https://example.com/media3.mp3', 'AUDIO', 'media3.mp3', 512000, NULL),
    (6, 'https://example.com/media4.pdf', 'FILE', 'media4.pdf', 307200, NULL),
    (7, 'https://example.com/media5.jpg', 'IMAGE', 'media5.jpg', 512, 'https://example.com/thumb5.jpg'),
    (8, 'https://example.com/video3.mp4', 'VIDEO', 'video3.mp4', 5242880, 'https://example.com/thumb6.jpg'),
    (9, 'https://example.com/media6.jpg', 'IMAGE', 'media6.jpg', 2560, 'https://example.com/thumb7.jpg'),
    (10, 'https://example.com/media7.mp3', 'AUDIO', 'media7.mp3', 102400, NULL),
    (11, 'https://example.com/media8.pdf', 'FILE', 'media8.pdf', 409600, NULL),
    (12, 'https://example.com/media9.jpg', 'IMAGE', 'media9.jpg', 1536, 'https://example.com/thumb8.jpg'),
    (13, 'https://example.com/video4.mp4', 'VIDEO', 'video4.mp4', 10240000, 'https://example.com/thumb9.jpg'),
    (14, 'https://example.com/media10.jpg', 'IMAGE', 'media10.jpg', 2048, 'https://example.com/thumb10.jpg'),
    (15, 'https://example.com/media11.mp3', 'AUDIO', 'media11.mp3', 204800, NULL),
    (16, 'https://example.com/media12.pdf', 'FILE', 'media12.pdf', 512000, NULL),
    (17, 'https://example.com/media13.jpg', 'IMAGE', 'media13.jpg', 5120, 'https://example.com/thumb11.jpg'),
    (18, 'https://example.com/video5.mp4', 'VIDEO', 'video5.mp4', 15728640, 'https://example.com/thumb12.jpg'),
    (19, 'https://example.com/media14.jpg', 'IMAGE', 'media14.jpg', 8192, 'https://example.com/thumb13.jpg'),
    (20, 'https://example.com/media15.mp3', 'AUDIO', 'media15.mp3', 256000, NULL);

-- Dữ liệu mẫu cho bảng PinnedMessages
INSERT INTO Messaging.PinnedMessages (ConversationID, MessageID, PinnedByUserID, PinnedAt)
VALUES
    (1, 1, 1, '2023-10-01 08:00:00'),
    (1, 2, 2, '2023-10-01 08:10:00'),
    (1, 3, 3, '2023-10-01 08:20:00'),
    (2, 4, 4, '2023-10-02 10:10:00'),
    (2, 5, 5, '2023-10-02 10:15:00'),
    (3, 6, 6, '2023-10-02 11:00:00'),
    (3, 7, 7, '2023-10-02 11:10:00'),
    (4, 8, 8, '2023-10-03 14:00:00'),
    (4, 9, 9, '2023-10-03 14:30:00'),
    (5, 10, 10, '2023-10-04 09:00:00'),
    (6, 11, 1, '2023-10-04 09:10:00'),
    (6, 12, 2, '2023-10-04 09:20:00'),
    (7, 13, 3, '2023-10-05 11:00:00'),
    (7, 14, 4, '2023-10-05 11:20:00'),
    (8, 15, 5, '2023-10-06 12:00:00'),
    (8, 16, 6, '2023-10-06 12:10:00'),
    (9, 17, 7, '2023-10-07 13:00:00'),
    (9, 18, 8, '2023-10-07 13:10:00'),
    (10, 19, 9, '2023-10-08 14:00:00'),
    (10, 20, 10, '2023-10-08 14:10:00');



