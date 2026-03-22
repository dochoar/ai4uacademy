import os
from pdf2image import convert_from_path
from PIL import Image, ImageFilter
import sys

def blur_pdf(input_path, output_path, blur_radius=15):
    """
    Convierte un PDF a imágenes, aplica un desenfoque al 70% inferior de cada página
    y vuelve a guardarlo como PDF.
    """
    print(f"Procesando: {os.path.basename(input_path)}...")
    
    try:
        # Convertir PDF a una lista de imágenes (una por página)
        # 200 DPI es un buen balance entre calidad y velocidad
        pages = convert_from_path(input_path, dpi=200)
        
        processed_pages = []
        
        for i, page in enumerate(pages):
            width, height = page.size
            
            # Calcular el punto donde empieza el desenfoque (30% desde arriba)
            split_at = int(height * 0.3)
            
            # Dividir la página en dos partes
            top_part = page.crop((0, 0, width, split_at))
            bottom_part = page.crop((0, split_at, width, height))
            
            # Aplicar desenfoque a la parte inferior
            blurred_bottom = bottom_part.filter(ImageFilter.GaussianBlur(radius=blur_radius))
            
            # Unir las partes de nuevo
            new_page = Image.new('RGB', (width, height))
            new_page.paste(top_part, (0, 0))
            new_page.paste(blurred_bottom, (0, split_at))
            
            processed_pages.append(new_page)
            print(f"  Página {i+1} procesada.")
            
        # Guardar todas las imágenes procesadas como un único PDF
        if processed_pages:
            processed_pages[0].save(
                output_path,
                "PDF",
                save_all=True,
                append_images=processed_pages[1:]
            )
            print(f"✓ Guardado en: {output_path}")
            
    except Exception as e:
        print(f"✗ Error procesando {input_path}: {e}")

def main():
    # Directorio actual
    docs_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(docs_dir, "procesados")
    
    # Crear carpeta de salida si no existe
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Carpeta creada: {output_dir}")
    
    # Si se pasa un argumento, procesar solo ese archivo
    if len(sys.argv) > 1:
        filename = sys.argv[1]
        # Si el usuario pasó la ruta completa, extraemos solo el nombre
        pdf_files = [os.path.basename(filename)]
    else:
        # Listar archivos PDF en el directorio
        pdf_files = [f for f in os.listdir(docs_dir) if f.lower().endswith('.pdf')]
    
    if not pdf_files:
        print("No se encontraron archivos PDF para procesar.")
        return

    print(f"Iniciando procesamiento de {len(pdf_files)} archivo(s)...")
    
    for pdf in pdf_files:
        input_path = os.path.join(docs_dir, pdf)
        
        # Verificar si el archivo existe
        if not os.path.exists(input_path):
            print(f"✗ El archivo no existe: {input_path}")
            continue
            
        output_name = pdf.replace(".pdf", "_blurred.pdf")
        output_path = os.path.join(output_dir, output_name)
        
        blur_pdf(input_path, output_path)

if __name__ == "__main__":
    main()
