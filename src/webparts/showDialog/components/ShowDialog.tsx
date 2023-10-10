import * as React from 'react';
import styles from './ShowDialog.module.scss';
import { IShowDialogProps } from './IShowDialogProps';
import { PrimaryButton } from '@fluentui/react/lib';
import { IFile, IResponseItem, IImageFile } from "./interfaces";
import { Logger, LogLevel } from "@pnp/logging";
import { getSP } from '../pnpjsConfig';
import  TaskDialog from './sampleDialog/TaskDialog'
import relativeTime from 'dayjs/plugin/relativeTime';

export interface IShowDialogState {
  items: IFile[];
  errors: string[];
  images: IImageFile[];
  renderList: boolean;
}
import dayjs from 'dayjs';
dayjs.extend(relativeTime);
import { SPFI } from '@pnp/sp';

export default class ShowDialog extends React.Component<IShowDialogProps, IShowDialogState> {
  private LOG_SOURCE = "🅿PnPjsExample";
  private LIST_NAME = "Loomis_intranet";
  //private IMAGE_LIST_NAME: "Images1";
  //private DOCUMENT_NAME = "Documents";
  private _sp: SPFI;  

  constructor(props: IShowDialogProps) {
    super(props);
    // set initial state
    this.state = {
      items: [],
      errors: [],
      images: [],
      renderList: false
    };
    this._sp = getSP();
  }

  public render(): React.ReactElement<IShowDialogProps> {  
    // Functionality logic (Unchanged)
    //this._readListItems();  
    //this. _readImages(); 
    this._updateList();

    return (
      <section style={{ fontFamily: 'Arial, sans-serif' }}>
          <div style={{ textAlign: 'center', margin: '10px 0 30px' }}>
            <PrimaryButton text='Skriv inlägg' onClick={this._createTask} />
          </div>   

          <div style={{ width: '100%' }}>
            {this.state.items.map((item, idx) => {
              return (
                <article style={{ padding: '15px', borderBottom: '1px solid #e5e5e5' }}>
                  <div style={{ background: `url(${item.imageLink}) center / cover no-repeat`, width: '100%', height: '250px' }}></div>
                  <h1 style={{ fontSize: '24px', margin: '10px 0' }}>{item.Title}</h1>
                  <p style={{ margin: '10px 0' }}>{dayjs(item.Created).fromNow()}</p>
                  <div className={styles.info_block} style={{ margin: '10px 0' }}>
                    <p style={{ color: '#888' }}>{item.Author0}</p>  
                  </div>                           
                  <p style={{ margin: '10px 0', lineHeight: '1.5' }}>{item.Content}</p>
                </article>
              );
            })}
          </div>     
      </section>
    );
}


private _createTask = async (): Promise<void> => {
  const taskDialog = new TaskDialog(      
    async (header, content, author) => {
      // After a task is created, re-fetch the list items to reflect the change
      await this._readListItems();
    },
    async () => alert('You closed the dialog!')
  );
  this.setState({renderList: true});
  taskDialog.show();  
}

  // private _createTask = async (): Promise<void> => {
  //   const taskDialog = new TaskDialog(      
  //     async (header, content, author) => {},
  //     async () => alert('You closed the dialog!')
  //   );
  //   this.setState({renderList: true});
  //   taskDialog.show();  
  // }

  private _updateList = async (): Promise<void> => {
    if(this.state.renderList == true){
      console.log("i true")
    }else {
      console.log("i false")
    }
  }

  private _readListItems = async (): Promise<void> => {
    try{
      // Removing caching here
      const response: IResponseItem[] = await this._sp.web.lists
        .getByTitle(this.LIST_NAME)
        .items
        .select("Id", "Title", "Content", "Author0", "Date","imageLink")
        .orderBy("Created", false)();

      // use map to convert IResponseItem[] into our internal object IFile[]
      const items: IFile[] = response.map((item: IResponseItem) => {
        return {
          Id: item.Id || 123,
          Title: item.Title || "Unknown",
          Content: item.Content || "Unknown",
          Author0: item.Author0 || "Unknown",
          Date: item.Date || "Unknown",
          imageLink: item.imageLink || "Unknown",
          Created: item.Created
        };
      });
      this.setState({ items });
      console.log(items);
    } 
    catch(err){
      Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
}

  componentDidMount() {
    this._readListItems();
  }

  /*private _readImages = async (): Promise<void> => {
    try{
      const spCache = spfi(this._sp).using(Caching({store:"session"}));

      const response: IImageItem[] = await spCache.web.lists
        .getById('eb5302f6-c3c9-4375-8db8-46b85e2a7862')
        .items
        .select()();

      // use map to convert IResponseItem[] into our internal object IFile[]
      const images: IImageFile[] = response.map((item: IImageItem) => {
        return {
          Id: item.Id || 123,
          LinkJson: item.exampleImage|| "Unknown"
        };
      });
      this.setState({ images });

      } 	
      catch(err){
      Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  } */ 
}