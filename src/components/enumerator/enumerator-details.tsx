import {
  ArrayField,
  BooleanField,
  CloneButton,
  ChipField,
  Datagrid,
  DateField,
  EditButton,
  NumberField,
  ReferenceArrayField,
  ReferenceManyField,
  ReferenceManyCount,
  RichTextField,
  SelectField,
  ShowContextProvider,
  ShowView,
  SingleFieldList,
  TabbedShowLayout,
  TextField,
  UrlField,
  useShowController,
  FunctionField,
  ImageField,
} from "react-admin";
import { SubmissionTitle } from "./enumerator-title";
import { getImageFromMinio } from "../../utils/getImageFromMinio";

export const EnumeratorDetails = () => {
  const controllerProps = useShowController();

  console.log({ controllerProps });
  return (
    <ShowContextProvider value={controllerProps}>
      <ShowView title={<SubmissionTitle />}>
        <TabbedShowLayout>
          <TabbedShowLayout.Tab label="post.form.summary">
            <TextField source="id" />
            <TextField source="spdpVillageId" />
            {Object.keys(controllerProps.record.submissionData).map(item=> {
                if(Array.isArray(controllerProps.record.submissionData[item])){   
                 
//                  return    controllerProps.record.submissionData[item].map(async(url:string,index:number)=>{
//                      const temp =await getImageFromMinio(url)
                     
//                      if(temp){
//                      // return <ImageField  key={`${index}-${item}`} source={`submissionData.${item}`} src={`${temp}`}/>
// return <img src={temp} alt="dd" key={`${index}-${item}`}/>
//                      }else return <>Fetching</>
//                                           })
                } else
                return  <FunctionField
                key={item}
                label={item}
                render={(record: any) => {
                  return `${record.submissionData[item]}`;
                }}
              />
            })}
            <FunctionField
              label="Claimant Name"
              render={(record: any) => {
                return `${record.submissionData.claimantName}`;
              }}
            />
            {/* <ArrayField source="backlinks">
                
                    <Datagrid bulkActionButtons={false}>
                        <DateField source="capturedAt" />
                        <UrlField source="spdpVillageId" />
                    </Datagrid>
                </ArrayField> */}
          </TabbedShowLayout.Tab>
          <TabbedShowLayout.Tab label="post.form.body">
            <RichTextField source="body" stripTags={false} label={false} />
          </TabbedShowLayout.Tab>
          <TabbedShowLayout.Tab label="post.form.miscellaneous">
            <ReferenceArrayField
              reference="tags"
              source="tags"
              // sort={{ field: `name.${locale}`, order: 'ASC' }}
            >
              <SingleFieldList>
                <ChipField
                  //  source={`name.${locale}`}
                  size="small"
                />
              </SingleFieldList>
            </ReferenceArrayField>
            <DateField source="published_at" />
            <SelectField
              source="category"
              choices={[
                { name: "Tech", id: "tech" },
                { name: "Lifestyle", id: "lifestyle" },
              ]}
            />
            <NumberField source="average_note" />
            <BooleanField source="commentable" />
            <TextField source="views" />
            <CloneButton />
          </TabbedShowLayout.Tab>
          {/* <TabbedShowLayout.Tab
                label="post.form.comments"
                count={
                    <ReferenceManyCount
                        reference="comments"
                        target="post_id"
                        sx={{ lineHeight: 'inherit' }}
                    />
                }
            >
                <ReferenceManyField
                    reference="comments"
                    target="post_id"
                    sort={{ field: 'created_at', order: 'DESC' }}
                >
                    <Datagrid>
                        <DateField source="created_at" />
                        <TextField source="author.name" />
                        <TextField source="body" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
                
            </TabbedShowLayout.Tab> */}
        </TabbedShowLayout>
      </ShowView>
    </ShowContextProvider>
  );
};
