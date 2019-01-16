export interface SpecsOptions {
  name: string;

  mocks?: boolean;
  stdMocks?: boolean;
  tests?: boolean;
  imports?: boolean;
  service?: boolean;
  component?: boolean;

  tmpl?: {
    imports?: string[];
  };
  path?: string;
  importPath?: string;
  specPath?: string;
}
