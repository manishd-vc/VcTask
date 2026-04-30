import { merge } from 'lodash';
import Alert from './Alert';
import AppBar from './appBar';
import AutoComplete from './autocomplete';
import Button from './button';
import Card from './card';
import Checkbox from './checkbox';
import Chip from './Chip';
import ControlLabel from './controlLabel';
import DateTimePicker from './dateTimePicker';
import Dialog from './dialog';
import Divider from './divider';
import Drawer from './drawer';
import Input from './input';
import LinearProgress from './linearLoader';
import Link from './link';
import Lists from './lists';
import LoadingButton from './loadingButton';
import Pagination from './pagination';
import Paper from './paper';
import Popover from './popover';
import RadioButton from './radioButton';
import Select from './select';
import Skeleton from './skeleton';
import SnackBar from './snackBar';
import SvgIcon from './svgIcon';
import Switch from './switch';
import Table from './table';
import Tabs from './tabs';
import Tooltip from './Tooltip';
// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme) {
  return merge(
    AppBar(theme),
    Tabs(theme),
    Card(theme),
    Link(theme),
    Input(theme),
    Lists(theme),
    Table(theme),
    Paper(theme),

    Dialog(theme),
    Drawer(theme),
    Tooltip(theme),
    Popover(theme),
    SvgIcon(theme),
    Checkbox(theme),
    Skeleton(theme),
    Pagination(theme),
    ControlLabel(theme),
    LoadingButton(theme),
    DateTimePicker(theme),
    Select(theme),
    Switch(theme),
    SnackBar(theme),
    Alert(theme),
    LinearProgress(theme),
    Chip(theme),
    RadioButton(theme),
    Button(theme),
    AutoComplete(theme),
    Divider(theme)
  );
}
