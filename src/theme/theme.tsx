import { ActionIcon, Checkbox, createTheme } from '@mantine/core'
import actionIconClasses from './ActionIcon.module.css'
import checkBoxClasses from './Checkbox.module.css'

export const theme = createTheme({
  primaryColor: 'main',
  colors: {
    purple: [
      '#f3edff',
      '#e0d7fa',
      '#beabf0',
      '#9a7ce6',
      '#7c56de',
      '#683dd9',
      '#5f2fd8',
      '#4f23c0',
      '#451eac',
      '#3a1899',
    ],
    main: [
      '#e6fdf6',
      '#d6f6ed',
      '#b0ebd9',
      '#86dfc4',
      '#64d5b3',
      '#4dcfa7',
      '#3fcca1',
      '#2eb38b',
      '#21a17c',
      '#008b69',
    ],
  },

  components: {
    Checkbox: Checkbox.extend({
      classNames: checkBoxClasses,
    }),
    ActionIcon: ActionIcon.extend({
      classNames: actionIconClasses,
    }),
  },
})
