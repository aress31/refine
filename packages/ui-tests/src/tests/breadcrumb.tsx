import React from "react";
import { Route, Routes } from "react-router-dom";
import type { RefineBreadcrumbProps } from "@refinedev/ui-types";

import { act, type ITestWrapperProps, render, TestWrapper } from "@test";

const renderBreadcrumb = (
  children: React.ReactNode,
  wrapperProps: ITestWrapperProps = {},
) => {
  return render(
    <Routes>
      <Route path="/:resource/:action" element={children} />
    </Routes>,
    {
      wrapper: TestWrapper(wrapperProps),
    },
  );
};

const DummyResourcePage = () => <div>Dummy</div>;

export const breadcrumbTests = (
  Breadcrumb: React.ComponentType<RefineBreadcrumbProps<any>>,
): void => {
  describe("[@refinedev/ui-tests] Common Tests / CRUD Create", () => {
    it("should not render breadcrumb when no items are present", async () => {
      const { container } = renderBreadcrumb(<Breadcrumb />);

      expect(container).toBeEmptyDOMElement();
    });

    it("should render breadcrumb when the number of items is equal to or greater than minItems", async () => {
      const { getByText } = renderBreadcrumb(<Breadcrumb minItems={1} />, {
        resources: [{ name: "posts" }],
        routerInitialEntries: ["/posts"],
      });

      getByText("Posts");
    });

    it("should not render breadcrumb when the number of items is less than minItems", async () => {
      const { container } = renderBreadcrumb(<Breadcrumb minItems={3} />, {
        resources: [{ name: "posts" }],
        routerInitialEntries: ["/posts/create"],
      });

      expect(container).toBeEmptyDOMElement();
    });

    it("should render breadcrumb items with link", async () => {
      const { container } = renderBreadcrumb(<Breadcrumb />, {
        resources: [{ name: "posts", list: DummyResourcePage }],
        routerInitialEntries: ["/posts/create"],
      });

      expect(container.querySelector("a")?.getAttribute("href")).toBe("/posts");
    });

    it("should render breadcrumb items with resource icon", async () => {
      const { getByTestId } = renderBreadcrumb(<Breadcrumb />, {
        resources: [
          {
            name: "posts",
            icon: <div data-testid="resource-icon" />,
          },
        ],
        routerInitialEntries: ["/posts/create"],
      });

      getByTestId("resource-icon");
    });

    it("should render breadcrumb items without resource icon", async () => {
      const { queryByTestId } = renderBreadcrumb(<Breadcrumb hideIcons />, {
        resources: [
          {
            name: "posts",
            icon: <div data-testid="resource-icon" />,
          },
        ],
        routerInitialEntries: ["/posts/create"],
      });

      expect(queryByTestId("resource-icon")).not.toBeInTheDocument();
    });
  });
};
