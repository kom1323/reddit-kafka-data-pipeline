import os
import kagglehub
import shutil


def download_and_move(dataset_id: str, target_dir: str):
    os.makedirs(target_dir, exist_ok=True)
    
    os.environ["KAGGLE_CONFIG_DIR"] = "secrets"

    # Download dataset - may return folder path or zip file path
    downloaded_path = kagglehub.dataset_download(dataset_id)
    print("Downloaded to:", downloaded_path)



    if os.path.isdir(downloaded_path):
        files = os.listdir(downloaded_path)
        print("Files in cache folder:", files)
        
        # Move each file from cache folder to target_dir
        for filename in files:
            src_path = os.path.join(downloaded_path, filename)
            dest_path = os.path.join(target_dir, filename)
            
            # If file exists at destination, overwrite it
            if os.path.exists(dest_path):
                os.remove(dest_path)
            shutil.move(src_path, dest_path)
        
        print(f"Moved files to {target_dir}")
        return target_dir
    else:
        raise RuntimeError("Expected a folder with extracted files, got a file.")
    
if __name__ == "__main__":
    dataset = "psparks/instacart-market-basket-analysis"  
    download_folder = "datasets"
    download_and_move(dataset, download_folder)