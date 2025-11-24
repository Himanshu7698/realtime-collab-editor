// custom/EditImagePlugin.ts
import { Plugin } from 'ckeditor5';
import { ButtonView } from 'ckeditor5';

export default class EditImagePlugin extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('editImage', () => {
      const button = new ButtonView();

      button.set({
        label: 'Edit Image',
        tooltip: true,
        withText: true,
      });

      button.on('execute', () => {
        const selection = editor.model.document.selection;
        const imageElement = selection.getSelectedElement();

        if (imageElement && imageElement.is('element', 'imageBlock')) {
          const attrs: Record<string, any> = {};
          for (const [key, value] of imageElement.getAttributes()) {
            attrs[key] = value;
          }
          const src = attrs['src'];
          if (src) {
            if (typeof (editor as any).openImageEditor === 'function') {
              (editor as any).openImageEditor(src);
            }
          }
        }
      });

      return button;
    });
  }
}
