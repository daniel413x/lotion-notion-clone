import {
  useRef, useState, ElementRef,
} from 'react';
import useOnKeyDown from '@/lib/hooks/useOnKeyDown';

const useInlineEditing = () => {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);
  const textareaRef = useRef<ElementRef<'textarea'>>(null);
  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
      textareaRef.current?.focus();
      textareaRef.current?.select();
      textareaRef.current?.setSelectionRange(0, textareaRef.current.value.length);
    });
  };
  const disableEditing = () => {
    setIsEditing(false);
  };
  const onBlur = () => {
    formRef.current?.requestSubmit();
  };
  const onEscape = () => {
    if (!isEditing) {
      return;
    }
    disableEditing();
  };
  useOnKeyDown('Escape', onEscape);
  const onEnter = () => {
    if (!isEditing) {
      return;
    }
    disableEditing();
  };
  useOnKeyDown('Enter', onEnter);
  return {
    formRef,
    inputRef,
    textareaRef,
    isEditing,
    enableEditing,
    disableEditing,
    onBlur,
  };
};

export default useInlineEditing;
