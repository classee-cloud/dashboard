import React from "react";
import { Box, Drawer, DrawerContent, useDisclosure } from "@chakra-ui/react";
import { SidebarContent, MobileNav } from "./Navbar/NavBar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import About from "./About";
import LoginPage from "./LoginPage";
import AddRepo from "./AddRepo";

export default function HomePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />

      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/addrepo" element={<AddRepo />} />
        </Routes>
      </Box>
    </div>
  );
}
