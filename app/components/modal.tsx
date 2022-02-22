export const ModalContainer = ({
  children,
  ...props
}: {
  children: React.ReactNode
}) => (
  <div className="modal-container" {...props}>
    {children}
  </div>
)

export const ModalContent = ({
  children,
  ...props
}: {
  children: React.ReactNode
}) => (
  <div className="modal-content" {...props}>
    {children}
  </div>
)

export const Modal = ({ children }: { children: React.ReactNode }) => (
  <ModalContainer>
    <ModalContent>{children}</ModalContent>
  </ModalContainer>
)
