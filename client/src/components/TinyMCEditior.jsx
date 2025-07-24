import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TinyMCEEditor({ value, onChange, placeholder = "Write your report..." }) {
  return (
    <div className="border border-gray-500 rounded-lg bg-white shadow-sm">
      <Editor
        apiKey={"xogeefeualo6yhgnl8ny0sfaufl6z3trgrbjmc0zzjc2nwv1"}
        value={value}
        onEditorChange={onChange}
        init={{
          height: 300,
          menubar: false,
          plugins: [
            "lists",
            "table",
            "advlist",
            "autolink",
            "link",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
          ],
          toolbar:
            "undo redo | bold italic underline  bullist numlist table forecolor removeformat",
          placeholder,
          contextmenu: 'table',
          content_style:
            "body { font-family:Inter,Arial,sans-serif; font-size:16px; } table { border-collapse: collapse; width: 100%; } td, th { border: 2px solid #2f4f4f; padding: 8px; }",
          table_toolbar:
            'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
          branding: false,
        }}
      />
    </div>
  );
}
