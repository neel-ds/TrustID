import { NextPage } from "next";
import { useState, useEffect } from "react";
import React from "react";
import Head from "next/head";
import Input from "../components/form-elements/input";
import Button from "../components/form-elements/button";
import FileUpload from "../components/form-elements/file-upload";
import Header from "../components/form-components/Header";
import {
  useContractEvent,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { useToast } from "@chakra-ui/react";
import { Web3Storage } from "web3.storage";
import landABI from "../contracts/land.json";
import { useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Image,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { QRCode } from "react-qr-svg";
import { CONTRACT_ADDRESS } from "../utils/contractAddress";
import { create, useStore } from "zustand";

interface State {
  name: string;
}

const AddLand: NextPage = () => {
  const useStore = create<State>((set) => ({
    name: "",
    setName: (name: string) => set({ name }),
  }));
  // const store = useStore();
  // store.setName(e.target.value)
  const [productData, setProductData] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState("");

  const [userAddress, setUserAddress] = useState("");

  const handleData = (e: any) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const { address, isConnected } = useAccount();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // useContractEvent({
  //   address: "0x2298cCe5c77225Cc3f320a3acCaD1a9639206852",
  //   abi: ABI,
  //   eventName: "ProofSubmitted",
  //   listener: (eventHappened, userAddress, error) => {
  //     if (eventHappened) {
  //       setUserAddress(userAddress as string);
  //     }
  //   },
  // });


  const toast = useToast();

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: landABI,
    functionName: "registerLand",
    args: [
      (productData as any).id,
      (productData as any).Name,
      `${(productData as any).address + (productData as any).Location + (productData as any).pincode}`,
      (productData as any).locationURL,
      imageUrl,
      (productData as any).dimensions,
    ],
  });
  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setProductData({
          locationURL: `https://www.google.com/maps?q=${latitude},${longitude}`,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Product Added",
        description: "Product has been added successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (userAddress == address) {
      toast({
        title: "Manufacturer Role Verified",
        description: "Manufacturer Role has been verified successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      onClose();
      write?.();
      setUserAddress("");
    }
  }, [userAddress]);

  return (
    <>
      <Head>
        <title>Add Land Information</title>
        <meta name="description" content="Chain - Register Land" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-4 md:px-0 my-8 mx-auto max-w-[1080px]">
        <div className="pt-5 pb-5 mx-auto max-w-7xl">
          <Header heading="Create Record of Rights" />
          <div className="flex flex-col w-full text-center">
            <div className="flex justify-center w-full py-4 overflow-x-hidden overflow-y-auto md:inset-0 md:h-full">
              <div className="relative w-full h-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow bg-opacity-20 dark:bg-gray-700 dark:bg-opacity-20">
                  <div className="px-6 py-6 lg:px-8">
                    <form className="space-y-6">
                      <div className="flex flex-col md:flex-row md:space-x-5">
                        <div className="w-full space-y-6 md:w-1/2 mb-7 md-mb-0">
                          <Input
                            id="id"
                            name="id"
                            label="Land ID"
                            type="text"
                            placeholder="Enter Your Land ID"
                            onChange={(e) => { handleData(e) }}
                          />

                          <Input
                            id="name"
                            name="Name"
                            label="Owner's name "
                            type="text"
                            placeholder="Enter Your Name"
                            onChange={(e) => { handleData(e) }}
                          />
                          <Input
                            id="Address"
                            name="address"
                            label="Owner's Address"
                            placeholder="Enter Your Address"
                            onChange={(e) => { handleData(e) }}
                          />

                          <Input
                            id="dimensions"
                            name="dimensions"
                            label="Property dimensions"
                            placeholder="Enter the dimensions of your land"
                            onChange={(e) => { handleData(e) }}
                          />
                        </div>
                        <div className="w-full space-y-6 md:w-1/2">
                          <Input
                            id="Location"
                            name="Location"
                            label="Land Area"
                            placeholder="Location"
                            onChange={(e) => { handleData(e) }}
                          />
                          <Input
                            id="pincode"
                            name="pincode"
                            label="PINCODE"
                            placeholder="Enter Landmark PIN Code"
                            type="number"
                            onChange={(e) => { handleData(e) }}
                          />

                          <div className="flex space-x-5">
                            <FileUpload
                              id="productimage"
                              name="productimage"
                              label="Proof of ownership"
                              onChange={(e: any) => {
                                const image = URL.createObjectURL(
                                  e.target.files[0]
                                );
                                setImage(image);
                                const files = (e.target as HTMLInputElement)
                                  .files!;
                                const client = new Web3Storage({
                                  token:
                                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkxZTRjOEMwNTJiMzkzNEQ3Nzc5NWM3QWQ3MkQ0MTFhMGQyMWUxODIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzE2ODYwNTU1NjIsIm5hbWUiOiJNYXRpYy1Qcm9maWxlIn0.zDWjIoqZUCnPXtvWXjm_ZbvPN2ZZHTfcK7JHdM2S7hk",
                                });
                                client.put(files).then((cid) => {
                                  console.log(cid);
                                  setImageUrl(
                                    `https://${cid}.ipfs.w3s.link/${files[0].name}`
                                  );
                                });
                              }}
                            />
                            <Image
                              src={image !== "" ? image : "/preview.png"}
                              alt="preview"
                              width={200}
                              height={200}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="max-w-[200px] flex m-auto">
                        <Button label="Register RoR" onClick={
                          () => {
                            write?.()
                          }} />
                        <Modal onClose={onClose} isOpen={isOpen} isCentered>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>
                              {" "}
                              Verify your Manufacturer Role
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <Text className="pb-5 text-sm font-semibold text-center text-gray-500 -pt-5">
                                Please verify with the same wallet address that
                                is connected to this site.
                              </Text>
                              <Box className="flex flex-col items-center justify-center">
                                {/* <QRCode
                                  level="Q"
                                  style={{ width: 350 }}
                                  value={JSON.stringify(manufacturerQR)}
                                /> */}
                              </Box>
                            </ModalBody>
                            <ModalFooter>
                              <Button label="Close" onClick={onClose} />
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AddLand;
