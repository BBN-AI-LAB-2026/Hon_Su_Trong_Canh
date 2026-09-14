import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import HistoryEduRoundedIcon from '@mui/icons-material/HistoryEduRounded';
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded';
import { ScrollBoxItem } from '../types';

export const HOME_ANIMATED_BANNER_SRC =
  'https://res.cloudinary.com/inwwexot/image/upload/v1789290537/%E1%BA%A2nh_%C4%91%E1%BB%99ng_home.gif';

export const HOME_SCROLL_BOXES: ScrollBoxItem[] = [
  {
    id: 'box-dang-anh',
    title: 'Đăng ảnh',
    desc: 'Tải ảnh hoặc chụp trực tiếp.',
    icon: <PhotoCameraRoundedIcon sx={{ fontSize: { xs: 19, sm: 21 } }} />,
  },
  {
    id: 'box-research',
    title: 'Tra cứu di tích',
    desc: 'Khám phá lịch sử và địa danh.',
    icon: <SearchIcon sx={{ fontSize: { xs: 19, sm: 21 } }} />,
  },
  {
    id: 'box-nhan-dien',
    title: 'AI Nhận diện',
    desc: 'Nhận diện di tích qua hình ảnh.',
    icon: <AutoAwesomeRoundedIcon sx={{ fontSize: { xs: 19, sm: 21 } }} />,
  },
  {
    id: 'box-so-do-kien-thuc',
    title: 'Sơ đồ kiến thức',
    desc: 'Học lịch sử qua sơ đồ trực quan.',
    icon: <AccountTreeRoundedIcon sx={{ fontSize: { xs: 19, sm: 21 } }} />,
  },
  {
    id: 'box-khoi-phuc-dong-thoi-gian',
    title: 'Game thú vị',
    desc: 'Thử thách kiến thức lịch sử.',
    icon: <HistoryEduRoundedIcon sx={{ fontSize: { xs: 19, sm: 21 } }} />,
  },
  {
    id: 'box-vr-tour',
    title: 'VR 360° Tour',
    desc: 'Khám phá di tích sống động.',
    icon: <ViewInArRoundedIcon sx={{ fontSize: { xs: 19, sm: 21 } }} />,
  },
];
