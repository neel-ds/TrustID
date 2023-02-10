import { NextPage } from "next";
import { useState, useEffect } from "react";
import React from "react";
import Head from "next/head";
import Button from "../components/form-elements/button";
import FileUpload from "../components/form-elements/file-upload";
import Header from "../components/form-components/Header";
import { Input, useToast } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import jwt_decode from "jwt-decode";

const Kyc: NextPage = () => {
  const [token, setToken] = useState("");
  const [schema, setSchema] = useState("");
  const [schemaLink, setClaimLink] = useState("");
  const [dob, setDob] = useState("");
  const [aadhar, setAadhar] = useState("");

  const [image, setImage] = useState("");
  const toast = useToast();
  const [isSuccess, setstatus] = useState("");

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "KYC Verification",
        description: "KYC has been verified successfully",
        status: "success",
        duration: 10,
        isClosable: true,
      });
    }
  }, [isSuccess, toast]);

  const findAadharNumberAndDOB = (text: string) => {
    const aadharRegex = /\b\d{4}\s\d{4}\s\d{4}\b/;
    const dobRegex = /\b\d{2}\/\d{2}\/\d{4}\b/;
    const aadharMatch = text.match(aadharRegex);
    const dobMatch = text.match(dobRegex);
    if (aadharMatch && dobMatch) {
      return { aadharNumber: aadharMatch[0], dob: dobMatch[0] };
    }
    return null;
  };

  const execute = async (text: any) => {
    const aadharNumberAndDOB = findAadharNumberAndDOB(text);
    console.log(aadharNumberAndDOB?.aadharNumber.replace(/ /g, ""));
    console.log(aadharNumberAndDOB?.dob);

    setAadhar(aadharNumberAndDOB?.aadharNumber.replace(/ /g, "") as any);
    setDob(aadharNumberAndDOB?.dob as any);
    setstatus("True");
  };

  useEffect(() => {
    fetch("https://api-staging.polygonid.com/v1/orgs/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "application/json",
      },
      body: JSON.stringify({
        email: process.env.EMAIL,
        password: process.env.PASSWORD,
      }),
    })
      .then((response) => response.json())
      .then(({ token }) => {
        console.log("TOken is", token);
        setToken(token);
        const {
          account: { organization: issuerId },
        } = jwt_decode(token) as any;

        const tempSchemaLink = `https://api-staging.polygonid.com/v1/issuers/${issuerId}/schemas/${process.env.SCHEMA_ID}`;
        setClaimLink(`${tempSchemaLink}/offers`);
        return { token, tempSchemaLink };
      })
      .then(({ token, tempSchemaLink }) => {
        fetch(tempSchemaLink, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => setSchema(data));
      });
  }, []);

  const handleResults = (results: any) => {
    console.log("Results", results);
    fetch(schemaLink, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        attributes: Object.keys(results).map((k) => {
          const removeDashes = results[k].indexOf("-") !== 0;
          const val = removeDashes
            ? results[k].replaceAll("-", "")
            : results[k];
          return {
            attributeKey: k,
            attributeValue: parseInt(val),
          };
        }),
      }),
    })
      .then((response) => response.json())
      .then(({ id }) => {
        console.log(`https://platform-test.polygonid.com/claim-link/${id}`);
        window.open(
          `https://platform-test.polygonid.com/claim-link/${id}`,
          "_newtab"
        );
      });
  };

  return (
    <>
      <Head>
        <title>KYC Verification</title>
        <meta name="description" content="Chain - Add Product" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-4 md:px-0 mx-auto max-w-[1080px]">
        <div className="pt-5 pb-5 mx-auto mt-5 max-w-7xl">
          <Header heading="Claim DID" />
          <div className="flex flex-col w-full text-center md:flex-row">
            <div className="flex justify-center w-full mb-10 overflow-x-hidden overflow-y-auto md:w-1/2 md:mb-0 md:p-4 md:inset-0 md:h-full">
              <div className="relative w-full h-full md:h-auto ">
                <div className="relative bg-white rounded-lg shadow backdrop-blur-lg bg-opacity-20 dark:bg-gray-700 dark:bg-opacity-20">
                  <div className="px-6 py-10 lg:px-8">
                    <form className="space-y-10 ">
                      <FileUpload
                        id="productimage"
                        name="productimage"
                        label="Proof of Personhood"
                        onChange={(e: any) => {
                          e.preventDefault();
                          const image = URL.createObjectURL(e.target.files[0]);
                          console.log(e.target.files[0]);
                          setImage(image);
                          const data = new FormData();
                          data.append(
                            "file",
                            e.target.files[0],
                            e.target.files[0].name
                          );

                          const options = {
                            method: "POST",
                            headers: {
                              "X-RapidAPI-Key":
                                "b6c828fff1msh2511ee51b094d03p1e49e9jsn476e7135f1ba",
                              "X-RapidAPI-Host": "ocr-nanonets.p.rapidapi.com",
                            },
                            body: data,
                          };

                          fetch("https://ocr-nanonets.p.rapidapi.com/", options)
                            .then((response) => response.json())
                            .then((response) => {
                              const rawData =
                                response.results[0].page_data[0].raw_text;
                              execute(rawData);
                              console.log(
                                response.results[0].page_data[0].raw_text
                              );
                            })

                            .catch((err) => console.error(err));
                        }}
                      />
                      <div className="flex space-x-5">
                        <Image
                          src={image !== "" ? image : "/preview.png"}
                          alt="preview"
                          width={150}
                          height={150}
                        />
                        <div>
                          <div className="flex mb-5 space-x-5 text-gray-100">
                            DOB: {dob}
                          </div>
                          <div className="flex space-x-5 text-gray-100">
                            Aadhar: {aadhar}
                          </div>
                        </div>
                      </div>
                      <div className="max-w-[200px] space-x-5 m-auto">
                        <Button
                          label="Submit"
                          onClick={(e) => {
                            e.preventDefault();
                            handleResults({
                              IDNUMBER: aadhar,
                              DOB: dob
                                .split("/")
                                .reverse()
                                .join("/")
                                .replace(/\//g, "-"),
                            });
                            console.log(
                              "Token",
                              aadhar,
                              dob
                                .split("/")
                                .reverse()
                                .join("/")
                                .replace(/\//g, "-"),
                              token
                            );
                          }}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Image
                src="/reg.png"
                className="pt-20"
                width="500"
                height="350"
                alt="Register"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Kyc;
