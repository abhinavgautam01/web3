use proc_macro::TokenStream;
use quote::quote;
use syn::{Data, DeriveInput, Fields};

#[proc_macro_derive(SerializeNumberStruct)]
pub fn serialize_number_struct(input: TokenStream)-> TokenStream {
    let ast: DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;

    let serialize_fields = match &ast.data {
        Data::Struct(data_struct)=>{
            match &data_struct.fields{
                Fields::Named(fields)=>{
                    let field_serializations = fields.named.iter().map(|field| {
                        let field_name = &field.ident;
                        quote! {
                            result.extend_from_slice(&self.#field_name.to_be_bytes());
                        }
                    });
                    quote! {
                        #(#field_serializations)*
                    }
                }
                _=> panic!("Only Named structs are allowed..!")
            }
        }
        _=> panic!("Only Structs are allowed..!")
    };

    let generated = quote! {
        impl Serialize for #name {
            fn serialize(&self)->Vec<u8>{
                let mut result = Vec::new();
                #serialize_fields
                result
            }
        }
    };
    generated.into()
}

#[proc_macro_derive(DeserializeNumberStruct)]
pub fn deserialize_number_struct(input: TokenStream)->TokenStream {
    let ast: DeriveInput = syn::parse(input).unwrap();
    let name = &ast.ident;

    let (deserialize_fields, field_assignments, total_size) = match &ast.data {
        Data::Struct(data_struct)=> {
            match &data_struct.fields {
                Fields::Named(fields)=> {
                    let mut fields_deserialization = Vec::new();
                    let mut field_assignments = Vec::new();
                    let mut offset: usize = 0;

                    for field in &fields.named{
                        let field_name = &field.ident;
                        let field_size = 4;
                        let start_offset = offset;
                        let end_offset = offset + field_size;

                        fields_deserialization.push(quote! {
                            let #field_name = {
                                let bytes: [u8; 4] = base[#start_offset..#end_offset]
                                    .try_into()
                                    .map_err(|_| Error)?;
                                i32::from_be_bytes(bytes)
                            };
                        });

                        field_assignments.push(quote!{
                            #field_name
                        });

                        offset += field_size;
                    }
                    (fields_deserialization, field_assignments, offset)
                }
                _=> panic!("Only named structs are allowed")
            }
        }
        _=> panic!("Only Structs are allowed..!")
    };

    let generated = quote! {
        impl Deserialize for #name {
            fn deserialize(base: &[u8])->Result<Self, Error>{
                if base.len() < #total_size {
                    return Err(Error);
                }
                #(#fields_deserialization)*

                Ok(#name {
                    #(#field_assignments,)*
                })
            }
        }
    };
    generated.into()
}