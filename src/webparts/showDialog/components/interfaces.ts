// create File item to work with it internally
export interface IFile {
    Id: number;
    Title: string;
    Content: string;
    Author0: string;
    Date: string;
    imageLink: string;
    Created: Date;
  }

  // create File item to work with it internally with images
export interface IImageFile{
  Id: number;
  LinkJson: JSON;
}
  
  // create PnP JS response interface for File
  export interface IResponseFile {
    Length: number;
  }
  
  // create PnP JS response interface for Item
  export interface IResponseItem {
    Id: number;
    File: IResponseFile;
    FileLeafRef: string;
    Title: string;
    Content: string;
    Author0: string;
    Date: string;
    imageLink: string;
    Created: Date;
  }

  export interface IImageItem{
    Id: number;
    exampleImage: JSON;
  }