export type CheckBoxSettingsT = { name: string; isChecked: boolean };
export type DateSettingsT = { start: string; end: string };
export type RStateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
