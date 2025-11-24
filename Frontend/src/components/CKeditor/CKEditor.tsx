// import { useState, useEffect, useRef, useMemo } from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import {
//   ClassicEditor,
//   Alignment,
//   AutoImage,
//   BlockQuote,
//   Bold,
//   Essentials,
//   FontBackgroundColor,
//   FontColor,
//   FontFamily,
//   FontSize,
//   Heading,
//   ImageBlock,
//   ImageCaption,
//   ImageEditing,
//   ImageInline,
//   ImageInsert,
//   ImageInsertViaUrl,
//   ImageResize,
//   ImageStyle,
//   ImageTextAlternative,
//   ImageToolbar,
//   ImageUpload,
//   ImageUtils,
//   Italic,
//   Link,
//   LinkImage,
//   List,
//   ListProperties,
//   MediaEmbed,
//   Paragraph,
//   Underline,
//   SimpleUploadAdapter,
// } from 'ckeditor5';
// import { Base64UploadAdapter } from 'ckeditor5';
// import 'ckeditor5/ckeditor5.css';
// import EditImagePlugin from './EditImagePlugin';

// interface CkEditorProps {
//   value: string;
//   onChange: (data: string) => void;
//   placeholder?: string;
//   className?: string;
//   disabled?: boolean;
// }

// const LICENSE_KEY = 'GPL';

// export default function CkEditor({ value, onChange, placeholder, className = '', disabled = false }: CkEditorProps) {
//   const editorContainerRef = useRef<HTMLDivElement | null>(null);
//   const editorRef = useRef<HTMLDivElement | null>(null);
//   const [isLayoutReady, setIsLayoutReady] = useState(false);
//   const [data, setData] = useState(value);

//   // state for TUI image editor modal
//   useEffect(() => {
//     setIsLayoutReady(true);
//     return () => setIsLayoutReady(false);
//   }, []);

//   const editorConfig = useMemo(() => {
//     if (!isLayoutReady) return undefined;

//     return {
//       toolbar: {
//         items: [
//           'undo',
//           'redo',
//           'heading',
//           'bold',
//           'italic',
//           'underline',
//           'fontSize',
//           'fontFamily',
//           'fontColor',
//           'fontBackgroundColor',
//           'alignment',
//           'numberedList',
//           'bulletedList',
//           'blockQuote',
//           'link',
//           'insertImage',
//           'mediaEmbed',
//         ],
//         shouldNotGroupWhenFull: false,
//       },
//       plugins: [
//         Essentials,
//         Bold,
//         Italic,
//         Underline,
//         FontBackgroundColor,
//         FontColor,
//         FontFamily,
//         FontSize,
//         Paragraph,
//         Heading,
//         List,
//         ListProperties,
//         Alignment,
//         BlockQuote,
//         Link,
//         AutoImage,
//         ImageBlock,
//         ImageCaption,
//         ImageEditing,
//         ImageInline,
//         ImageInsert,
//         ImageInsertViaUrl,
//         ImageResize,
//         ImageStyle,
//         ImageTextAlternative,
//         ImageToolbar,
//         ImageUpload,
//         ImageUtils,
//         LinkImage,
//         MediaEmbed,
//         Base64UploadAdapter,
//         SimpleUploadAdapter,
//         EditImagePlugin,
//       ],
//       fontFamily: { supportAllValues: true },
//       fontSize: { options: [10, 12, 14, 'default', 18, 20, 22], supportAllValues: true },
//       heading: {
//         options: [
//           { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
//           { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
//           { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
//           { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
//           { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
//           { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
//           { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
//         ],
//       },
//       image: {
//         toolbar: [
//           'toggleImageCaption',
//           'imageTextAlternative',
//           '|',
//           'imageStyle:inline',
//           'imageStyle:wrapText',
//           'imageStyle:breakText',
//           '|',
//           'resizeImage',
//           'editImage',
//         ],
//       },
//       licenseKey: LICENSE_KEY,
//       placeholder: placeholder ?? 'Type or paste your content here...',
//     };
//   }, [isLayoutReady, placeholder]);


//   useEffect(() => {
//     setData(value);
//   }, [value]);

//   return (
//     <>
//       <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
//         <div className={`editor-container__editor ${className}`} ref={editorRef}>
//           {editorConfig && (
//             <CKEditor
//               disabled={disabled}
//               editor={ClassicEditor}
//               config={editorConfig as any}
//               data={data}
//               onChange={(_, editor) => {
//                 const data = editor.getData();
//                 setData(data);
//                 onChange(data);
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
